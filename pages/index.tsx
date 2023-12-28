import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import {generateClient} from 'aws-amplify/data';
import {Schema} from '@/amplify/data/resource';

const client = generateClient<Schema>();

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [todos, setTodos] = useState<Schema['Todo'][]>([]);

  async function listTodos() {
    const {data} = await client.models.Todo.list();
    setTodos(data);
  }

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
      setTodos([...items])
    );
  
    return () => sub.unsubscribe();
  }, []);

  return (
    <main>
      <h1>Hello, Amplify 👋</h1>
      <button onClick={async () => {
        // create a new Todo with the following attributes
        const { errors, data: newTodo } = await client.models.Todo.create({
          // prompt the user to enter the title
          content: window.prompt("title"),
          done: false,
          priority: 'medium'
        })
        console.log(errors, newTodo);
      }}>Create </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </main>
  );
}
