"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { motion } from "framer-motion";

export default function Prereq() {
  const [skill, setSkill] = useState(null);

  return (
    <main className="text-white bg-slate-900 w-screen h-screen px-72 mx-auto py-40">
      <div className="flex items-center gap-4 text-2xl font-bold mb-4">
        <h2 className="text-2xl font-bold">I&apos;m a(n) </h2>
        <Select className="" onValueChange={(v) => setSkill(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="beginner">beginner</SelectItem>
              <SelectItem value="intermediate">intermediate</SelectItem>
              <SelectItem value="expert">expert</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {skill !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold">Intro</h2>
          <p className="">- summarize keys words with ai</p>
        </motion.div>
      ) : null}
      {skill !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold">Sources</h2>
          <p className="">use aryamans code for scraping youtube links</p>
        </motion.div>
      ) : null}
    </main>
  );
}
