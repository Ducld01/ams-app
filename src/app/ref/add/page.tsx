import { Metadata } from "next";
import { CreateRefForm } from "./_sections";
import { Refs } from "@/app/types";

export const metadata: Metadata = {
  title: "Thêm mới Ref",
};

export default function AddLinkRef() {

  async function handleSubmit(data: Pick<Refs, 'name' | 'url'>) {
    'use server'
     await fetch('http://localhost:3000/api/refs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  return <CreateRefForm onSubmit={handleSubmit}/>;
}
