import {describe, expect, test} from 'vitest';
import {Container} from './ioc';
import {define, provide} from './di';

describe('ioc pattern', () => {
	test('different scopes', async () => {
		const GetCurrentUser = define<{id: number; email: string}>(
			'GetCurrentUser',
		);
		const DbConnection = define<{
			query<T>(str: string, args: unknown[]): Promise<T>;
		}>('DbConnection');
		const Session = define<{
			getUserId(): {id: number};
		}>('Session');

		const expected = 1;

		const SessionImpl = provide({
			token: Session,
			value: {
				getUserId() {
					return {id: expected};
				},
			},
		});

		const DbConnectionImpl = provide({
			token: DbConnection,
			get value() {
				return {
					async query<T>(str: string, args: unknown[]) {
						return {
							id: args[0],
							email: 'email@email.com',
						} as T;
					},
				};
			},
		});

		const GetCurrentUserImpl = provide({
			token: GetCurrentUser,
			deps: [Session, DbConnection],
			async factory(session, db) {
				const userId = session.getUserId();

				const user = await db.query<{id: number; email: string}>(
					'SELECT * FROM USERS WHERE ID = :ID',
					[userId.id],
				);

				return user;
			},
		});

		const ct = new Container()
			.addSingleton(GetCurrentUserImpl)
			.addTransient(DbConnectionImpl)
			.addScoped(SessionImpl);

		const user = await ct.run(async () => {
			const user1 = await ct.resolve(GetCurrentUser);
			const user2 = await ct.resolve(GetCurrentUser);
			expect(user1).toBe(user2);
			return user1;
		});

		expect(user).toEqual({
			id: expected,
			email: 'email@email.com',
		});

		const db1 = await ct.resolve(DbConnection);
		const db2 = await ct.resolve(DbConnection);
		expect(db1).not.toBe(db2);
	});
});
