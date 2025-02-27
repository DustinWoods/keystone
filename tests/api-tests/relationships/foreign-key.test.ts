import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { relationship } from '@keystone-6/core/fields';
import { apiTestConfig, dbProvider, getPrismaSchema } from '../utils';

test('when not specifying foreignKey in a one to one relationship, the side is picked based on the list key + field key ordering', async () => {
  const prismaSchema = await getPrismaSchema(
    apiTestConfig({
      lists: {
        A: list({
          access: allowAll,
          fields: {
            b: relationship({ ref: 'B.a' }),
          },
        }),
        B: list({
          access: allowAll,
          fields: {
            a: relationship({ ref: 'A.b' }),
          },
        }),
      },
    })
  );
  expect(prismaSchema)
    .toEqual(`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${dbProvider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${dbProvider}"
}

generator client {
  provider = "prisma-client-js"
}

model A {
  id  String  @id @default(cuid())
  b   B?      @relation("A_b", fields: [bId], references: [id])
  bId String? @unique @map("b")
}

model B {
  id String @id @default(cuid())
  a  A?     @relation("A_b")
}
`);
});

test('when specifying foreignKey: true in a one to one relationship, that side has the foreign key', async () => {
  const prismaSchema = await getPrismaSchema(
    apiTestConfig({
      lists: {
        A: list({
          access: allowAll,
          fields: {
            b: relationship({ ref: 'B.a' }),
          },
        }),
        B: list({
          access: allowAll,
          fields: {
            a: relationship({ ref: 'A.b', db: { foreignKey: true } }),
          },
        }),
      },
    })
  );
  expect(prismaSchema)
    .toEqual(`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${dbProvider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${dbProvider}"
}

generator client {
  provider = "prisma-client-js"
}

model A {
  id String @id @default(cuid())
  b  B?     @relation("B_a")
}

model B {
  id  String  @id @default(cuid())
  a   A?      @relation("B_a", fields: [aId], references: [id])
  aId String? @unique @map("a")
}
`);
});

test('when specifying foreignKey: { map } in a one to one relationship, that side has the foreign key with the map', async () => {
  const prismaSchema = await getPrismaSchema(
    apiTestConfig({
      lists: {
        A: list({
          access: allowAll,
          fields: {
            b: relationship({ ref: 'B.a' }),
          },
        }),
        B: list({
          access: allowAll,
          fields: {
            a: relationship({ ref: 'A.b', db: { foreignKey: { map: 'blah' } } }),
          },
        }),
      },
    })
  );
  expect(prismaSchema)
    .toEqual(`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${dbProvider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${dbProvider}"
}

generator client {
  provider = "prisma-client-js"
}

model A {
  id String @id @default(cuid())
  b  B?     @relation("B_a")
}

model B {
  id  String  @id @default(cuid())
  a   A?      @relation("B_a", fields: [aId], references: [id])
  aId String? @unique @map("blah")
}
`);
});

test('when specifying foreignKey: true on both sides of a one to one relationship, an error is thrown', async () => {
  await expect(
    getPrismaSchema(
      apiTestConfig({
        lists: {
          A: list({
            access: allowAll,
            fields: {
              b: relationship({ ref: 'B.a', db: { foreignKey: true } }),
            },
          }),

          B: list({
            access: allowAll,
            fields: {
              a: relationship({ ref: 'A.b', db: { foreignKey: true } }),
            },
          }),
        },
      })
    )
  ).rejects.toMatchInlineSnapshot(
    `[Error: You can only set db.foreignKey on one side of a one to one relationship, but foreignKey is set on both A.b and B.a]`
  );
});

test('when specifying foreignKey: { map } on both sides of a one to one relationship, an error is thrown', async () => {
  await expect(
    getPrismaSchema(
      apiTestConfig({
        lists: {
          A: list({
            access: allowAll,
            fields: {
              b: relationship({ ref: 'B.a', db: { foreignKey: { map: 'blah' } } }),
            },
          }),

          B: list({
            access: allowAll,
            fields: {
              a: relationship({ ref: 'A.b', db: { foreignKey: { map: 'other' } } }),
            },
          }),
        },
      })
    )
  ).rejects.toMatchInlineSnapshot(
    `[Error: You can only set db.foreignKey on one side of a one to one relationship, but foreignKey is set on both A.b and B.a]`
  );
});

test('foreignKey: true in a many to one relationship is the same as not specifying foreignKey: true', async () => {
  const getPrismaSchemaForForeignKeyVal = (foreignKey: boolean) =>
    getPrismaSchema(
      apiTestConfig({
        lists: {
          A: list({
            access: allowAll,
            fields: {
              b: relationship({ ref: 'B.a', many: true }),
            },
          }),
          B: list({
            access: allowAll,
            fields: {
              a: relationship({ ref: 'A.b', db: foreignKey ? { foreignKey: true } : undefined }),
            },
          }),
        },
      })
    );

  expect(await getPrismaSchemaForForeignKeyVal(true)).toEqual(
    await getPrismaSchemaForForeignKeyVal(false)
  );
});

test('foreignKey: { map } in a many to one relationship sets the @map attribute on the foreign key', async () => {
  const prismaSchema = await getPrismaSchema(
    apiTestConfig({
      lists: {
        A: list({
          access: allowAll,
          fields: {
            b: relationship({ ref: 'B.a', many: true }),
          },
        }),
        B: list({
          access: allowAll,
          fields: {
            a: relationship({ ref: 'A.b', db: { foreignKey: { map: 'something' } } }),
          },
        }),
      },
    })
  );

  expect(prismaSchema)
    .toEqual(`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${dbProvider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${dbProvider}"
}

generator client {
  provider = "prisma-client-js"
}

model A {
  id String @id @default(cuid())
  b  B[]    @relation("B_a")
}

model B {
  id  String  @id @default(cuid())
  a   A?      @relation("B_a", fields: [aId], references: [id])
  aId String? @map("something")

  @@index([aId])
}
`);
});
