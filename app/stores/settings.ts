import {$store} from '@lib/dom';

export const appSettings = $store({
	theme: 'light' as 'light' | 'dark',
	locale: 'en' as 'en' | 'es',
	title: '',
});
