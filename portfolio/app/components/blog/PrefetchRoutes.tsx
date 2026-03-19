"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PrefetchRoutesProps {
  hrefs: string[];
}

export default function PrefetchRoutes({ hrefs }: PrefetchRoutesProps) {
  const router = useRouter();

  useEffect(() => {
    for (const href of hrefs) {
      router.prefetch(href);
    }
  }, [hrefs, router]);

  return null;
}
