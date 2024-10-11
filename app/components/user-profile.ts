import {Context} from '@lib/ctx/context';
import {$component, html, $store} from '@lib/dom';

export type User = {
	name: string;
	email: string;
	dob: Date;
};

export const currentUser = $store<User>({
	name: '',
	email: '',
	dob: new Date(),
});

export default $component(function UserProfile() {
	return html`
		<section>
			<h1>${currentUser.name}</h1>
			<p>${currentUser.email}</p>
			<p>${currentUser.dob.toDateString()}</p>
		</section>
	`;
});
