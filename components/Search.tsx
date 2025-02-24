import { Button, Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useBackgroundUpload } from "@/hooks/useBackgroundUpload";
import { pickImage, rS, rV } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

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
    const [image, setImage] = useState<string[]>([])
    const [res, setRes] = useState({
        status: "",
        progress: 0
    })

    const { startUpload } = useBackgroundUpload()
    const read = async () => {
        // readFileInChunks("file:///storage/14EB-310C/Download/[MV] IU(아이유) _ Palette(팔레트) (Feat. G-DRAGON).mp4")

        // uploadFileInChunks("file:///storage/14EB-310C/Download/[MV] IU(아이유) _ Palette(팔레트) (Feat. G-DRAGON).mp4", 1024 * 1024);
        // uploadFileInChunks("file:///storage/emulated/0/Download/Lovely.Runner.2024.S01E01.1080p.RGzsRutracker.mkv", 1024 * 1024);
        // const { url } = await fetch('http://10.0.2.2:1080/s3').then(res => res.json())
        // console.log(url)
        startUpload("file:///storage/emulated/0/Download/Lovely.Runner.2024.S01E01.1080p.RGzsRutracker.mkv", (progress) => setRes({ ...res, progress }))

    }
    return <View style={[styles.container]}>
        <Pressable style={[styles.trigger]} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="search" size={20} color={Colors.light.primary} />
            <Typography color={Colors.light.notSelected} variant="span">Введите номер нарушения...</Typography>
        </Pressable>
        <Modal visible={modalVisible} onRequestClose={closeModal} animationType="fade"  >
            <View style={[styles.modal]}>
                <Pressable onPress={closeModal}>
                    <Typography variant="h1">Hello</Typography>
                    <Pressable onPress={() => pickImage({ saveAsUri: (img) => setImage(img) })}>

                        <Typography variant="h3">Vibrat</Typography>
                    </Pressable>
                    <Button onPress={read} disabled={!image}>Read</Button>
                    <Typography variant="h3">{res.progress}</Typography>
                    <Main />
                </Pressable>
            </View>
        </Modal>
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
