import { readFileSync } from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PrismaClient, Prisma } from '@prisma/client'

//Load environment variables (populate process.env from .env file)
import dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings();

export const run = async () => {
  const folderPath = path.resolve('./dist/public/files/');
  const fileName = folderPath + '/listerine.txt';

  const fileContent = readFileSync(fileName, 'utf8');

  const res = await embeddings.embedQuery(fileContent);

  const prisma = new PrismaClient();

  const data = {
    title: 'listerine',
    content: 'listerine test',
    embeddings: res
  };


  // const sqlQuery = `INSERT INTO documents (title, content, embeddings) VALUES ('${data.title}', '${data.content}', '[${data.embeddings}]');`;

  // console.log(sqlQuery);

  // const createDocument = await prisma.$executeRaw`${sqlQuery}`

  /*
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice2@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })

  */

  let allUsers = await prisma.documents.findMany({
    select: {
      title: true,
      content: true
    },
  });



  //const list = await prisma.documents.findMany();

  return allUsers;
};
