import { rSendViolence } from "@/api/violence";

import { client } from "@/app/_layout";
import { FormContainer } from "@/components/forms/FormContainer";
import { MediaViewer } from "@/components/MediaViewer";
import { Button, DateTimePicker, Input, Select, Typography } from "@/components/ui";
import { Video } from "@/components/Video";
import { Colors } from "@/constants/Colors";
import { errorMsgs } from "@/consts";
import { useBackgroundUpload } from "@/hooks/useBackgroundUpload";
import { GetDate, GetTime, Modals } from "@/utils";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as MediaLibrary from 'expo-media-library';
import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DeviceEventEmitter, Dimensions, FlatList, Image, Keyboard, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View, ViewProps, ViewToken } from "react-native";
import Toast from "react-native-toast-message";
interface SendViolenceFormProps extends ViewProps {
    medias: MediaLibrary.Asset[]
    setMedias: (value: MediaLibrary.Asset[]) => void;
    handleCamera: (state: boolean) => void
}
export const SendViolenceForm = ({ medias, handleCamera, setMedias, style, ...props }: SendViolenceFormProps) => {
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues
    })
    const { startUpload } = useBackgroundUpload()
    const { mutate: send, isPending } = useMutation({
        mutationKey: ['sendViolence'], mutationFn: rSendViolence, onSuccess: async (violence) => {
            if (!violence) return;
            try {
                for (const i of medias) {
                    await startUpload(i, violence.id.toString())
                }
                reset()
                client.invalidateQueries({ queryKey: ['myVideos'] })
                setMedias([])
                Toast.show({ type: 'success', text1: "Отправлено", text2: "Нарушение было отправлено!" })
            } catch (e) {
                Toast.show({ type: 'error', text1: "Ошибка", text2: "Нарушение не было отправлено!" })
            }

        }, onError: (e) => {
            Toast.show({ type: 'error', text1: "Ошибка", text2: "Произошла ошибка" })
            console.log(e)
        }
    })
    const submit = async (data: typeof defaultValues) => {
        const body = new FormData()
        body.append('city', data.city)
        body.append('street', data.street)
        body.append('description', data.description)
        body.append('was_at_date', GetDate(data.dateTime.date))
        body.append('was_at_time', GetTime(data.dateTime.time) + ":00")
        send(body)
    }
    return <FormContainer style={[style, styles.container]} {...props}>
        <MediasView medias={medias} setMedias={setMedias} handleCamera={handleCamera} />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <ScrollView contentContainerStyle={[styles.form]}>
                <Input
                    rules={{ required: errorMsgs.required }}
                    error={errors.description?.message}
                    control={control}
                    input={{ multiline: true, numberOfLines: 3, placeholder: "Опишите нарушение" }} bg="dark" name="description" label="Описание" />
                <Controller
                    rules={{ required: errorMsgs.required }}
                    control={control} name="city" render={({ field: { onChange, value, onBlur } }) =>
                        <Select
                            error={errors.city?.message}
                            withSearch label="Город" items={kazakhstanCities} value={value} onSelect={(value) => onChange(value)} placeholder="Выберите город" />
                    } />
                <Input rules={{ required: errorMsgs.required }}
                    error={errors.street?.message}
                    bg="dark" name="street" control={control} input={{ placeholder: "Укажите улицу" }} label="Улица" />
                <Controller control={control} name="dateTime" render={({ field: { onChange, value, onBlur } }) => <DateTimePicker dateValue={value.date} timeValue={value.time} setValue={(key, newValue) => {
                    const updated = { ...value, [key]: newValue }
                    onChange(updated)
                }} bg="dark" label="Дата и время" />} />
                <Link href={'/settings/rules'}><Typography color={Colors.light.primary} variant="span">Правила размещения фото/видео</Typography></Link>
                <Button disabled={isPending || medias.length == 0} loading={isPending} variant="primary" onPress={handleSubmit(submit)}>Отправить</Button>
            </ScrollView>
        </TouchableWithoutFeedback>
    </FormContainer>
}

interface MediasViewProps {
    medias: MediaLibrary.Asset[]
    setMedias: (value: MediaLibrary.Asset[]) => void;
    handleCamera: (state: boolean) => void
}

const MediasView = ({ medias, setMedias, handleCamera }: MediasViewProps) => {
    const [currentItem, setCurrentItem] = useState<MediaLibrary.Asset | null>(null);
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
        const newMedias = medias.filter((item) => item.id !== itemToDelete); // Remove the item
        setMedias(newMedias);
        if (currentItem?.id === itemToDelete) {
            if (newMedias.length > 0) {
                const nextIndex = Math.min(
                    medias.findIndex(item => item.id == itemToDelete),
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
            ref={flatListRef} keyExtractor={(item, idx) => `${item.id}${idx}`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.mediasViews]} data={medias} renderItem={({ item }: { item: MediaLibrary.Asset }) => {
                if (item.uri.includes('mp4') || item.uri.includes('mov') || item.uri.includes('mkv')) {
                    return <Video source={item.uri} style={[styles.previewItem]} />
                }
                return <MediaViewer itemStyle={[styles.previewItem]} media={item.uri} />
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
        <View style={[styles.bottom]}><View style={[styles.mediasControls]}>
            <FlatList ref={controlsFlatListRef} keyExtractor={(item, idx) => `${item.id}${idx} `} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.controlsList]} data={medias} renderItem={({ item, index }) =>
                <View style={[styles.controlItem]}>
                    {currentItem == item ?
                        <Pressable style={[styles.deleteItem]} onPress={() => deleteMedia(item.id)}>
                            <MaterialIcons name="delete" color={Colors.light.background} size={23} />
                        </Pressable>
                        :
                        <Pressable onPress={() => {
                            setCurrentItem(item)
                            scrollToSelected(index)
                        }} style={[styles.selectItem]}>
                        </Pressable>}
                    <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
                </View>
            } />

            <AddNewButton medias={medias} setMedias={setMedias} openCamera={() => handleCamera(true)} />
        </View>
        </View>
    </View>
}
interface AddNewButtonProps {
    openCamera: () => void
    medias: MediaLibrary.Asset[],
    setMedias: (value: MediaLibrary.Asset[]) => void
}
const AddNewButton = ({ openCamera, medias, setMedias }: AddNewButtonProps) => {
    const [visible, setVisible] = useState(false)
    const handlePress = () => {
        DeviceEventEmitter.emit(Modals.importVariants, {
            openCamera, openGallery: () => {
                DeviceEventEmitter.emit(Modals.assetPicker, {
                    saveSelected: (newMedias: MediaLibrary.Asset[]) => {
                        setMedias([...medias, ...newMedias])
                    }
                })
            }
        })

    }
    return <Pressable style={[styles.controlItem, styles.addNew]} onPress={handlePress}>
        <Entypo name="plus" size={32} color={Colors.light.primary} />
    </Pressable>
}


const width = Dimensions.get('window').width
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        gap: 10,
        paddingTop: Constants.statusBarHeight,
        padding: 5,
    },
    mediaContainer: {
        minHeight: width * 9 / 16,
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
        width: 60, height: 40, borderRadius: 10, overflow: 'hidden',
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
    addNewContainer: {
        position: 'relative'
    },
    overlay: {
        position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.5)', zIndex: 9, flex: 1
    },
    addNewContent: {
        paddingHorizontal: 10,
        width: 'auto',
        minWidth: 44,
        justifyContent: 'space-around',
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 10,
        right: 0,
        top: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.53,
        shadowRadius: 13.97,

        zIndex: 10,
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
const kazakhstanCities = [
    "Алматы",
    "Нур-Султан",
    "Шымкент",
    "Караганда",
    "Актобе",
    "Тараз",
    "Павлодар",
    "Усть-Каменогорск",
    "Семей",
    "Костанай",
    "Атырау",
    "Кызылорда",
    "Петропавловск",
    "Уральск",
    "Темиртау",
    "Актау",
    "Туркестан",
    "Экибастуз",
    "Рудный",
    "Жезказган",
    "Балхаш",
    "Кентау",
    "Талдыкорган",
    "Кокшетау",
    "Сатпаев",
    "Каскелен",
    "Кульсары",
    "Риддер",
    "Шахтинск",
    "Абай",
    "Степногорск",
    "Каратау",
    "Жанаозен",
    "Аркалык"
];

const defaultValues = {
    city: kazakhstanCities[0],
    street: "",
    dateTime: {
        date: new Date(),
        time: new Date(),
    },
    description: ""
}

