import { CustomHeader, LinkList, ScreenContainer } from "@/components";
import { LinkProps, Tabs } from "expo-router";

const menuItems: { title: string, href: LinkProps['href'] }[] = [
    { title: "Правила дорожного движения РК", href: "/" },
    { title: "Таблица штрафов", href: "/" },
    { title: "Новости", href: "/news" },
    { title: "Отзывы и предложения", href: "/" },
];
export default function Services() {
    return <ScreenContainer>
        <Tabs.Screen options={{ header: () => <CustomHeader title="Сервисы" showBack={false} /> }} />
        <LinkList items={menuItems} />
    </ScreenContainer>
}
