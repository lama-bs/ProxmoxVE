import { useCallback, useEffect, useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { formattedBadge } from "@/components/CommandMenu";

export default function ScriptAccordion({
  items,
  selectedScript,
  setSelectedScript,
}: {
  items: Category[];
  selectedScript: string | null;
  setSelectedScript: (script: string | null) => void;
}) {
  const [expandedItem, setExpandedItem] = useState<string | undefined>(
    undefined,
  );
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  
  const handleAccordionChange = (value: string | undefined) => {
    setExpandedItem(value);
  };

  const handleSelected = useCallback(
    (title: string) => {
      setSelectedScript(title);
    },
    [setSelectedScript],
  );

  useEffect(() => {
    if (selectedScript) {
      const category = items.find((category) =>
        category.scripts.some((script) => script.name === selectedScript),
      );
      if (category) {
        setExpandedItem(category.name);
        handleSelected(selectedScript);
      }
    }
  }, [selectedScript, items, handleSelected]);
  return (
    <Accordion
      type="single"
      value={expandedItem}
      onValueChange={handleAccordionChange}
      collapsible
    >
      {items.map((category) => (
        <AccordionItem
          key={category.id + ":category"}
          value={category.name}
          className={cn("sm:text-md flex flex-col border-none", {
            "rounded-lg bg-accent/30": expandedItem === category.name,
          })}
        >
          <AccordionTrigger
            className={cn(
              "duration-250 rounded-lg transition ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-accent",
            )}
          >
            <div className="mr-2 flex w-full items-center justify-between">
              <span className="pl-2">{category.name} </span>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-muted-foreground hover:no-underline dark:bg-blue-800/20">
                {category.scripts.length}
              </span>
            </div>{" "}
          </AccordionTrigger>
          <AccordionContent
            data-state={
              expandedItem === category.name ? "open" : "closed"
            }
            className="pt-0"
          >
            {category.scripts
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((script, index) => (
                <div key={index}>
                  <Link
                    href={{
                      pathname: "/scripts",
                      query: { id: script.name},
                    }}
                    prefetch={false}
                    className={`flex cursor-pointer items-center justify-between gap-1 px-1 py-1 text-muted-foreground hover:rounded-lg hover:bg-accent/60 hover:dark:bg-accent/20 ${
                      selectedScript === script.name
                        ? "rounded-lg bg-accent font-semibold dark:bg-accent/30 dark:text-white"
                        : ""
                    }`}
                    onClick={() => handleSelected(script.name)}
                    ref={(el) => {
                      linkRefs.current[script.name] = el;
                    }}
                  >
                    <div className="flex items-center">
                      <Image
                        src={script.logo || "/logo.png"}
                        height={16}
                        width={16}
                        unoptimized
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/logo.png")
                        }
                        alt={script.name}
                        className="mr-1 w-4 h-4 rounded-full"
                      />
                      <span className="flex items-center gap-2">
                        {script.name}
                      </span>
                    </div>
                    {formattedBadge(script.type)}
                  </Link>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}