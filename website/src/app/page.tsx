import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { sql } from '@vercel/postgres';
import { readFile } from 'fs/promises';

export default async function Home() {

  try {
    console.log("Try to connect to DB")
    await sql`SELECT * FROM users`
    console.log("Connected to DB")
  } catch (error) {
    //Run DB migration
    console.log("Run migration")
    var schema = (await readFile('./src/db/schema.sql', 'utf-8')).toString().split(';').flatMap((query) => query.trim().replaceAll('\n', '').replaceAll('  ', '').replaceAll(',', ', ').concat(';')).filter((query) => query.length > 1)
    
    // Run the query
      schema.forEach(async (query) => {
        try {
          console.log("Run query", query)
          await sql.query(query)	
        } catch (error) {
          console.log("error", error)
        }
      })

  }

  return (
    <Sheet
      sx={{
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <p>hej</p>
    </Sheet>
  );
}
