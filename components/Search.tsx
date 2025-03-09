import { Button, Typography } from "@/components/ui";
import { Progressbar } from "@/components/ui/Progressbar";
import { Colors } from "@/constants/Colors";
import { useBackgroundUpload } from "@/hooks/useBackgroundUpload";
import { pickAssets, rS, rV } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

function getFileExtension(uri: string) {
    const match = /\.([a-zA-Z]+)$/.exec(uri)
    if (match !== null) {
        return match[1]
    }

    return ''
}
function getMimeType(extension: string) {
    if (extension === 'jpg') return 'image/jpeg'
    return `image/${extension}`
}



export const Search = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const closeModal = () => setModalVisible(false);
    const [image, setImage] = useState<MediaLibrary.Asset[]>([])
    const [res, setRes] = useState({
        status: "",
        progress: 0
    })

    const { startUpload } = useBackgroundUpload()
    const read = async () => {
        const promises = image.map(i => startUpload(i.uri, (progress) => setRes({ ...res, progress })))
        const images = await Promise.all(promises)
        const final = await fetch('http://10.0.2.2:3000/final', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                images: images.map(i => JSON.parse(i?.body ?? '').file),
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue',
            }),
        })
        console.log(final)

        const b = await final.json()
        console.log(b, "FINAL")
    }


    return <View style={[styles.container]}>
        <Pressable style={[styles.trigger]} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="search" size={20} color={Colors.light.primary} />
            <Typography color={Colors.light.notSelected} variant="span">Введите номер нарушения...</Typography>
        </Pressable>
        {modalVisible && <View style={[styles.modal]}>
            <Pressable onPress={() => pickAssets((a) => setImage(a))}>
                <Typography variant="h1">Hello</Typography>
            </Pressable>
            <Button onPress={read} disabled={!image}>Read</Button>
            <Progressbar value={res.progress} />
            <Typography variant="h3">{res.progress}</Typography>
            <Main />
        </View>
        }
    </View>
}
const Main = () => {
    const [albums, setAlbums] = useState<MediaLibrary.Album[] | null>(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    console.log(albums, "ALBUMS")
    async function getAlbums() {
        if (permissionResponse?.status !== 'granted') {
            await requestPermission();
        }
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
            includeSmartAlbums: true,
        });
        setAlbums(fetchedAlbums);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button onPress={getAlbums} >Get albums</Button>
            <ScrollView>
                {albums && albums.map((album) => <AlbumEntry key={album.id} album={album} />)}
            </ScrollView>
        </SafeAreaView>
    );
}
function AlbumEntry({ album, ...props }: { album: MediaLibrary.Album }) {
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

    useEffect(() => {
        async function getAlbumAssets() {
            const albumAssets = await MediaLibrary.getAssetsAsync({ album, mediaType: ['video', 'photo'] });
            setAssets(albumAssets.assets);
        }
        getAlbumAssets();
    }, [album]);


    console.log(assets)
    return (
        <View key={album.id}  {...props}>
            <Text>
                {album.title} - {album.assetCount ?? 'no'} assets
            </Text>
            <ScrollView>
                {assets && assets.map((asset) => (
                    <Image key={asset.uri} source={{ uri: asset.uri }} width={100} height={100} />
                ))}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: Colors.light.slate200,
        marginTop: Constants.statusBarHeight,
        alignItems: 'center',
        paddingVertical: rV(10),
        paddingHorizontal: rS(10),
    },
    trigger: {
        width: '100%',
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: rS(8),
        paddingHorizontal: rS(16),
        flexDirection: 'row', gap: rS(8),
        alignItems: 'center',
    },
    modal: {
        paddingTop: Constants.statusBarHeight
    }
})
