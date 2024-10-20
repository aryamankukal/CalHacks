"use client";

import { useState } from "react";
import { Slider } from "@/app/components/ui/slider";
import { motion } from "framer-motion";

export default function Prereq() {
  const [skill, setSkill] = useState(40);

  const translateSkill = (s) => {
    const trans = [
      "beginner",
      "novice",
      "intermediate",
      "advanced",
      "master",
      "i got this bro",
    ];

    return trans[s / 20];
  };

  return (
    <main className="text-blue-300 bg-slate-900 w-screen h-screen px-72 mx-auto pt-40">
      <div className="flex flex-col gap-4 text-2xl font-bold mb-8">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">
            My <span className="text-blue-300">skill level</span> is...
          </h2>
          <p className="text-blue-300">{translateSkill(skill)}</p>
        </div>
        <Slider
          onValueChange={(v) => setSkill(v)}
          defaultValue={[40]}
          max={100}
          step={20}
          className="[&_[role=slider]]:bg-blue-300 [&_[role=slider]]:text-blue-300"
        />
      </div>
      {skill !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold">
            Important <span className="text-blue-300">Concepts</span>
          </h2>
          <p className="text-blue-300">
            ttest tesintesintse tseintesintseot seo tkse tjksentjk
          </p>
        </motion.div>
      ) : null}
      {skill !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold">
            Relevant <span className="text-blue-300">Sources</span>
          </h2>
          <p className="text-blue-300">use aryamans code for scraping youtube links</p>
        </motion.div>
      ) : null}
    </main>
  );
}
