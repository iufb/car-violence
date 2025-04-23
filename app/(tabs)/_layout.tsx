import { Tabbar } from '@/components';
import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
    return (
        <Tabs
            backBehavior='history'
            tabBar={(props) => <Tabbar {...props} />}
        />
    );
}
