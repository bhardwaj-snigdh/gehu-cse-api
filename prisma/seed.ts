import { Notice, PrismaClient, Role, User } from '@prisma/client';
import { password } from '../src/utils';
const prisma = new PrismaClient();

type UserCreateType =
  | Omit<User, 'id'> & {
      Notice?: { create: Pick<Notice, 'title' | 'body' | 'audience'>[] };
    };

const users: UserCreateType[] = [
  {
    email: 'papa.pegion@birds.com',
    name: 'Papa Pegion',
    phone: '+91-0000000000',
    role: Role.ADMIN,
    ...password.createHashAndSalt('123admin'),
    Notice: {
      create: [
        {
          title: 'I am Admin... and this notice is for HODs',
          body: '# Hi HODs ...',
          audience: [Role.HOD],
        },
        {
          title: 'I am Admin... and this notice is for HODs and Faculty',
          body: '# Hi HODs ...\n## Hi faculty',
          audience: [Role.HOD, Role.FACULTY],
        },
        {
          title: 'Hello students I am admin :)',
          body: 'How you doing...?',
          audience: [Role.USER],
        },
        {
          title: 'Hello.. do you hear me?:)',
          body: '# AM I the only admin? ',
          audience: [Role.USER],
        },
      ],
    },
  },
  {
    email: 'hod.pegion@birds.com',
    name: 'HOD Pegion',
    phone: '+91-1111111111',
    role: Role.HOD,
    ...password.createHashAndSalt('123hod'),
    Notice: {
      create: [
        {
          title: 'I am HOD😒... and this notice is for HODs',
          body: '# Hi HODs ...',
          audience: [Role.HOD],
        },
        {
          title: 'I am HOD😒... and this notice is for HODs 222',
          body: '# Hi HODs ...',
          audience: [Role.HOD],
        },
        {
          title: 'I am HOD😒... and this notice is for HODs and Faculty',
          body: '# Hi HODs ...\n## Hi faculty',
          audience: [Role.HOD, Role.FACULTY],
        },
        {
          title: 'Hello students I am HOD😒 :)',
          body: 'How you doing...?',
          audience: [Role.USER],
        },
      ],
    },
  },
  {
    email: 'teacher1.pegion@birds.com',
    name: 'Teacher 1 Pegion',
    phone: '+91-0000000001',
    role: Role.FACULTY,
    ...password.createHashAndSalt('123f'),
    Notice: {
      create: [
        {
          title: 'I am Teacher1 😁... Echo #1',
          body: '# Hi Kids ...',
          audience: [Role.USER],
        },
        {
          title: 'I am Teacher1 😁... Echo #2',
          body: '# Hi Kids ...',
          audience: [Role.USER],
        },
        {
          title: 'I am Teacher1 😁... Echo #3',
          body: '# Hi Kids ...\n## Hi faculty',
          audience: [Role.USER, Role.FACULTY],
        },
        {
          title: 'I am Teacher1 😁... Echo #4',
          body: 'How you doing...?',
          audience: [Role.USER],
        },
      ],
    },
  },
  {
    email: 'teacher2.pegion@birds.com',
    name: 'Teacher 2 Pegion',
    phone: '+91-0000000002',
    role: Role.FACULTY,
    ...password.createHashAndSalt('123f'),
  },
  {
    email: 'teacher3.pegion@birds.com',
    name: 'Teacher 3 Pegion',
    phone: '+91-0000000001',
    role: Role.FACULTY,
    ...password.createHashAndSalt('123f'),
  },
  {
    email: 'first.pegion@birds.com',
    name: 'First Pegion',
    phone: '+91-9900000001',
    role: Role.USER,
    ...password.createHashAndSalt('123'),
  },
  {
    email: 'second.pegion@birds.com',
    name: 'Second Pegion',
    phone: '+91-9900000002',
    role: Role.USER,
    ...password.createHashAndSalt('123'),
  },
  {
    email: 'third.pegion@birds.com',
    name: 'Third Pegion',
    phone: '+91-9900000003',
    role: Role.USER,
    ...password.createHashAndSalt('123'),
  },
  {
    email: 'fourth.pegion@birds.com',
    name: 'Fourth Pegion',
    phone: '+91-9900000004',
    role: Role.USER,
    ...password.createHashAndSalt('123'),
  },
];

async function main() {
  const insertedUsers: User[] = [];
  const deletedUsers = await prisma.user.deleteMany();
  const deletedNotices = await prisma.notice.deleteMany();

  for (const user of users) {
    const insertedUser = await prisma.user.create({
      data: user,
    });

    insertedUsers.push(insertedUser);
  }

  return insertedUsers;
}

main()
  .then((insertedUsers) => {
    console.log('DB Seeding done.');
    console.dir(
      insertedUsers.map(({ id, email, role }) => ({
        id,
        email,
        role,
      }))
    );
  })
  .catch((err) => {
    console.error('Error: Unable to seed DB');
    console.error(err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
