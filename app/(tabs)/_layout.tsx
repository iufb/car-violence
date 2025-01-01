import { Tabbar } from '@/components';
import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
    return (
        <Tabs

            tabBar={(props) => <Tabbar {...props} />}
        />
    );
}
