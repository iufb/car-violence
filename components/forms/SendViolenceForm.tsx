import { rSendViolence } from "@/api/violence";

import { client } from "@/app/_layout";
import { FormContainer } from "@/components/forms/FormContainer";
import { Button, DateTimePicker, Input, Select, Typography } from "@/components/ui";
import { Video } from "@/components/Video";
import { Colors } from "@/constants/Colors";
import { errorMsgs } from "@/consts";
import { useBackgroundUpload } from "@/hooks/useBackgroundUpload";
import { GetDate, GetTime, showToast } from "@/utils";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as MediaLibrary from 'expo-media-library';
import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, FlatList, Image, Keyboard, Pressable, ScrollView, StyleSheet, TouchableOpacity, View, ViewProps, ViewToken } from "react-native";
interface SendViolenceFormProps extends ViewProps {
    medias: MediaLibrary.Asset[]
    setMedias: (value: MediaLibrary.Asset[]) => void;
    openCamera: () => void
}
export const SendViolenceForm = ({ medias, openCamera, setMedias, style, ...props }: SendViolenceFormProps) => {
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues
    })
    const { startUpload } = useBackgroundUpload()
    const { mutate: send, isPending } = useMutation({
        mutationKey: ['sendViolence'], mutationFn: rSendViolence, onSuccess: async (violence) => {
            if (!violence) return;
            console.log(violence.id)
            for (const i of medias) {
                const data = await startUpload(i, violence.id.toString())


            }
            reset()
            client.invalidateQueries({ queryKey: ['myVideos'] })
            setMedias([])
            showToast({ type: 'success', title: "Отправлено", desc: "Нарушение было отправлено!" })
        }, onError: (e) => {
            showToast({ type: 'error', title: "Ошибка", desc: "Произошла ошибка" })
            console.log(e)
        }
    })
    const submit = (data: typeof defaultValues) => {
        const body = new FormData()
        // medias.forEach(media => {
        //     const details = getFileDetails(media)
        //     body.append('videos', {
        //         uri: media,
        //         name: details?.fileName,
        //         type: details?.mimeType
        //     } as any)
        // })

        body.append('city', data.city)
        body.append('street', data.street)
        body.append('description', data.description)
        body.append('was_at_date', GetDate(data.dateTime.date))
        body.append('was_at_time', GetTime(data.dateTime.time) + ":00")
        console.log(body)
        send(body)
    }
    return <FormContainer style={[style, styles.container]} {...props}>
        <MediasView medias={medias} setMedias={setMedias} openCamera={openCamera} />
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
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
                <Link href={'/'}><Typography color={Colors.light.primary} variant="span">Правила размещения фото/видео</Typography></Link>
                <Button disabled={isPending || medias.length == 0} loading={isPending} variant="primary" onPress={handleSubmit(submit)}>Отправить</Button>
            </ScrollView>
        </TouchableOpacity>
    </FormContainer>
}

interface MediasViewProps {
    medias: MediaLibrary.Asset[]
    setMedias: (value: MediaLibrary.Asset[]) => void;
    openCamera: () => void
}

const MediasView = ({ medias, setMedias, openCamera }: MediasViewProps) => {
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
            ref={flatListRef} keyExtractor={(item, idx) => `${item.id}`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.mediasViews]} data={medias} renderItem={({ item }: { item: MediaLibrary.Asset }) => {
                if (item.uri.includes('mp4') || item.uri.includes('mov')) {
                    return <Video source={item.uri} style={[styles.previewItem]} />
                }
                return <Image source={{ uri: item.uri }} style={[styles.previewItem]} />
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
        <View style={[styles.bottom]}><View style={[styles.mediasControls]}>
            <FlatList ref={controlsFlatListRef} keyExtractor={(item, idx) => `${item.uri}`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.controlsList]} data={medias} renderItem={({ item, index }) =>
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
            <Pressable style={[styles.controlItem, styles.addNew]} onPress={openCamera}>
                <Entypo name="plus" size={32} color={Colors.light.primary} />
            </Pressable>
        </View>
        </View>
    </View>
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

