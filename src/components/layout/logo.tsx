"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import mainAvatar from "../../../mainAvatar.png";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Home">
      <motion.div
        className="flex h-10 w-10 items-center justify-center md:h-12 md:w-12"
        whileHover={{ scale: 1.08, rotate: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image
          src={mainAvatar}
          alt="Mohamedhen Vall"
          className="h-full w-full object-contain"
          priority
        />
      </motion.div>
    </Link>
  );
}
