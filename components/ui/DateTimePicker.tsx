import { Typography } from "@/components/ui/Typography"
import { Colors } from "@/constants/Colors"
import { Entypo, MaterialIcons } from "@expo/vector-icons"
import DateTimePickerLib, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useState } from "react"
import { Platform, Pressable, StyleSheet, View, ViewProps } from "react-native"
interface DateTimePickerProps extends ViewProps {
    label: string
    bg?: 'light' | 'dark'
}
export const DateTimePicker = ({ label, bg = 'light', style, ...props }: DateTimePickerProps) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate ?? new Date());
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    return <View style={[styles.container]}>
        <Typography color={bg == 'dark' ? Colors.light.background : Colors.light.text} variant="span">{label}</Typography>
        <View style={[styles.field]}>
            <Typography variant="span">{date.getUTCDate()}</Typography>
            <Typography variant="span"></Typography>
            {Platform.OS == 'ios' ? <View
                style={[styles.IOSpicker]}>
                <DateTimePickerLib
                    style={[styles.picker]}
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    onChange={onChange}
                />
                <DateTimePickerLib
                    testID="dateTimePicker"

                    style={[styles.picker]}
                    value={date}
                    mode={'time'}
                    onChange={onChange}
                />

            </View> : <View style={[styles.actionsWrapper]}>
                <Pressable onPress={showDatepicker} style={[styles.action]}><Entypo size={22} name="calendar" color={Colors.light.background} />
                    {show && mode == 'date' &&
                        <DateTimePickerLib
                            testID="dateTimePicker"
                            value={date}
                            mode={'date'}
                            onChange={onChange}
                        />}
                </Pressable>
                <Pressable onPress={showTimepicker} style={[styles.action]}><MaterialIcons size={22} name="access-time" color={Colors.light.background} />
                    {show && mode == 'time' &&
                        <DateTimePickerLib
                            testID="dateTimePicker"
                            value={date}
                            mode={'time'}
                            onChange={onChange}
                        />}

                </Pressable>
            </View>}
        </View>

    </View>
}



const styles = StyleSheet.create({
    container: {
        position: 'relative',
        gap: 7
    },
    field: {
        height: 48,
        borderColor: Colors.light.borderColor,
        backgroundColor: Platform.OS == 'ios' ? "rgba(0,0,0,.6)" : Colors.light.background,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16

    },
    actionsWrapper: {
        gap: 7,
        position: 'absolute',
        flexDirection: 'row',
        right: 10,
        top: '35%',
        bottom: "35%",
        transform: [{ translateY: '-50%' }]
    },
    action: {
        width: 34, height: 31, alignItems: 'center', justifyContent: "center", backgroundColor: Colors.light.primary, borderRadius: 10, position: 'relative',
    },
    IOSpicker: {
        position: 'absolute',
        left: 5,
        top: 10,
        flexDirection: 'row',
        gap: 2,
        overflow: 'hidden',
    },
    picker: {
        borderRadius: 10,
        justifyContent: 'center',
        maxHeight: 28

    }
})