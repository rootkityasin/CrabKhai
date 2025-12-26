import { getSiteConfig } from '@/app/actions/settings';
import { ShopClient } from './ShopClient';

export default async function ShopPage() {
    const config = await getSiteConfig();

    return <ShopClient initialConfig={config} />;
}
