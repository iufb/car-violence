import { FormContainer } from "@/components/forms/FormContainer"
import { Button, DateTimePicker, Input, Select, Typography } from "@/components/ui"
import { Video } from "@/components/Video"
import { Colors } from "@/constants/Colors"
import { Entypo, MaterialIcons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { Dimensions, FlatList, Image, Keyboard, Pressable, StyleSheet, TouchableOpacity, View, ViewProps, ViewToken } from "react-native"

interface SendViolenceFormProps extends ViewProps {
    medias: string[]
    setMedias: (value: string[]) => void;
    openCamera: () => void
}
const width = Dimensions.get('window').width

export const SendViolenceForm = ({ medias, openCamera, setMedias, style, ...props }: SendViolenceFormProps) => {
    const [formData, setFormData] = useState({
        city: "",
        street: "",
        date: new Date(),
        time: new Date(),
        violence: "",
    })
    const onChange = (key: string, value: string | Date) => {
        setFormData({ ...formData, [key]: value })
    }
    return <FormContainer style={[style, styles.container]} {...props}>
        <MediasView medias={medias} setMedias={setMedias} openCamera={openCamera} />
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <View style={[styles.form]}>
                <Input
                    multiline numberOfLines={3} bg="dark" placeholder="Опишите нарушение" value={formData.violence} onChangeText={(_, value) => onChange('violence', value)} label="Описание" />
                <Select label="Город" items={['Hello', 'World']} value={formData.city} onSelect={(value) => onChange('city', value)} placeholder="Выберите город" />
                <Input bg="dark" placeholder="Укажите улицу" value={formData.street} onChangeText={(_, value) => onChange('street', value)} label="Улица" />
                <DateTimePicker dateValue={formData.date} timeValue={formData.time} setValue={(key, value) => onChange(key, value)} bg="dark" label="Дата и время" />
                <Link href={'/'}><Typography color={Colors.light.primary} variant="span">Правила размещения фото/видео</Typography></Link>
                <Button variant="primary">Отправить</Button>
            </View>
        </TouchableOpacity>
    </FormContainer>
}

interface MediasViewProps {
    medias: string[]
    setMedias: (value: string[]) => void;
    openCamera: () => void
}

const MediasView = ({ medias, setMedias, openCamera }: MediasViewProps) => {
    const [currentItem, setCurrentItem] = useState<string | null>(null);
    const isManuallyScrolling = useRef(false);
    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50, // Item is considered "in view" if at least 50% is visible
    }).current;

    const flatListRef = useRef<FlatList>(null);
    const controlsFlatListRef = useRef<FlatList>(null);

    const scrollToSelected = (index: number) => {
        if (index >= 0 && index < medias.length) { // Validate the index
            isManuallyScrolling.current = true; // Disable onViewableItemsChanged temporarily
            flatListRef.current?.scrollToIndex({ animated: true, index });

            // Scroll the controls FlatList to the same index
            controlsFlatListRef.current?.scrollToIndex({
                animated: true,
                index,
                viewPosition: 0.5, // Center the selected item in view
            });

            // Re-enable onViewableItemsChanged after a short delay
            setTimeout(() => {
                isManuallyScrolling.current = false;
            }, 500);
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (!isManuallyScrolling.current && viewableItems.length > 0) {
            const visibleItem = viewableItems[0].item;
            const visibleIndex = medias.findIndex((media) => media === visibleItem);
            if (visibleIndex !== -1) { // Ensure the visible item exists in the current list 
                setCurrentItem(visibleItem);
                // Scroll the controls FlatList to match the visible item
                controlsFlatListRef.current?.scrollToIndex({
                    animated: true,
                    index: visibleIndex,
                    viewPosition: 0.5, // Center the selected item in view
                });
            }
        }
    }, [medias]);

    const deleteMedia = (itemToDelete: string) => {
        const newMedias = medias.filter((item) => item !== itemToDelete); // Remove the item
        setMedias(newMedias);

        if (currentItem === itemToDelete) {
            if (newMedias.length > 0) {
                const nextIndex = Math.min(
                    medias.indexOf(itemToDelete),
                    newMedias.length - 1
                ); // Choose the next valid index
                setCurrentItem(newMedias[nextIndex]);
                scrollToSelected(nextIndex);
            } else {
                setCurrentItem(null); // No items left
            }
        }
    };
    return <View style={[styles.mediaContainer]}>
        <FlatList
            initialNumToRender={1}
            removeClippedSubviews={true}
            ref={flatListRef} keyExtractor={(item, idx) => `${item}*idx`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.mediasViews]} data={medias} renderItem={({ item }: { item: string }) => {
                if (item.includes('mp4') || item.includes('mov')) {
                    return <Video source={item} style={[styles.previewItem]} />
                }
                return <Image source={{ uri: item }} style={[styles.previewItem]} />
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
        <View style={[styles.bottom]}><View style={[styles.mediasControls]}>
            <FlatList ref={controlsFlatListRef} keyExtractor={(item, idx) => `${item}***idx`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.controlsList]} data={medias} renderItem={({ item, index }) =>
                <View style={[styles.controlItem]}>
                    {currentItem == item ?
                        <Pressable style={[styles.deleteItem]} onPress={() => deleteMedia(item)}>
                            <MaterialIcons name="delete" color={Colors.light.background} size={23} />
                        </Pressable>
                        :
                        <Pressable onPress={() => {
                            setCurrentItem(item)
                            scrollToSelected(index)
                        }} style={[styles.selectItem]}>
                        </Pressable>}
                    <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
                </View>
            } />
            <Pressable style={[styles.controlItem, styles.addNew]} onPress={openCamera}>
                <Entypo name="plus" size={32} color={Colors.light.primary} />
            </Pressable>
        </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        gap: 10,
        padding: 5,
    },
    mediaContainer: {
        gap: 10,
    },
    mediasViews: {
        gap: 20
    },

    mediasControls: {
        backgroundColor: Colors.light.background,
        padding: 4,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 5,
    },
    form: {
        gap: 10
    },
    controlsList: {
        marginRight: 60,
        gap: 4
    },
    previewItem: {
        width: width - 20, height: width * 9 / 16, borderRadius: 10,
    },
    controlItem: {
        width: 60, height: 40, borderRadius: 10, overflow: 'hidden', position: 'relative',
        borderWidth: 2,
        borderColor: Colors.light.borderColor
    },
    deleteItem: {
        position: 'absolute', left: -1, right: 0, top: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,.7)',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectItem: {
        position: 'absolute', left: -1, right: 0, top: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 20,
    },
    addNew: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.light.primary,
        borderWidth: 1,
    },
    bottom: {
        paddingHorizontal: 15,
        gap: 8
    }
})
