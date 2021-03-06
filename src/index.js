import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';

// Init VK  Mini App
bridge.send('VKWebAppInit');

bridge.subscribe(({ detail: { type, data } }) => {
    if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
    }
});

ReactDOM.render(
    <ConfigProvider isWebView={true}>
        <AdaptivityProvider>
            <AppRoot>
                <App />
            </AppRoot>
        </AdaptivityProvider>
    </ConfigProvider>,
    document.getElementById('root')
);

if (process.env.NODE_ENV === 'development') {
    import('./eruda').then(() => {
        console.warn('Run Eruda');
    });
}
