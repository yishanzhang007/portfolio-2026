"use client";

import { Fragment, type ReactNode } from "react";

/* VS Code Light+ JSON syntax colors. Punctuation (braces, brackets, colons,
   commas) inherits the body's text-ink. */
const KEY = "text-[#0451a5]";
const STR = "text-[#a31515]";
const NUM = "text-[#098658]";
const BOOL = "text-[#0000ff]";

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [k: string]: Json };

/* Sample patient-match classification schema — content matches Figma node
   1147:45817. Trimmed to roughly the same depth the Figma shows. */
const data: Json = {
  metadata: {
    task: "Classify patient-match situations as confident, ambiguous, or no_match",
    created: "2026-04-13",
    author: "Yishan Zhang",
    context:
      "Patient verification for the Freed Front Desk agent. Given what the caller said and what the EHR patient-search API returned, the model must classify the match situation so the agent can decide what to do next.",
    labels: ["confident", "ambiguous", "no_match", "system_error"],
    schema_version: 1,
  },
  cases: [
    {
      id: "case_001",
      category: "confident_baseline",
      description: "Clean happy path — all identifiers align",
      caller_input: {
        spoken_name: "Sarah Chen",
        spoken_dob: "1985-03-15",
        caller_id_phone: "+14155551234",
      },
      ehr_search_results: [
        { patient_id: "P10234", name: "Sarah Chen", dob: "1985-03-15" },
      ],
    },
  ],
};

const INDENT = "  ";

function pad(n: number) {
  return INDENT.repeat(n);
}

/** Renders a JSON value with per-token color spans. */
function renderValue(v: Json, indent: number): ReactNode {
  if (v === null) return <span className={BOOL}>null</span>;
  if (typeof v === "boolean") return <span className={BOOL}>{String(v)}</span>;
  if (typeof v === "number") return <span className={NUM}>{v}</span>;
  if (typeof v === "string") return <span className={STR}>{`"${v}"`}</span>;
  if (Array.isArray(v)) return renderArray(v, indent);
  return renderObject(v as { [k: string]: Json }, indent);
}

function renderObject(obj: { [k: string]: Json }, indent: number): ReactNode {
  const keys = Object.keys(obj);
  if (keys.length === 0) return <>{"{}"}</>;
  return (
    <>
      {"{\n"}
      {keys.map((k, i) => (
        <Fragment key={k}>
          {pad(indent + 1)}
          <span className={KEY}>{`"${k}"`}</span>
          {": "}
          {renderValue(obj[k], indent + 1)}
          {i < keys.length - 1 ? "," : ""}
          {"\n"}
        </Fragment>
      ))}
      {pad(indent)}
      {"}"}
    </>
  );
}

function renderArray(arr: Json[], indent: number): ReactNode {
  if (arr.length === 0) return <>{"[]"}</>;
  // All-primitive arrays render inline (e.g. ["confident", "ambiguous", …]).
  const allPrimitive = arr.every(
    (x) => x === null || ["string", "number", "boolean"].includes(typeof x),
  );
  if (allPrimitive) {
    return (
      <>
        {"["}
        {arr.map((v, i) => (
          <Fragment key={i}>
            {renderValue(v, indent)}
            {i < arr.length - 1 ? ", " : ""}
          </Fragment>
        ))}
        {"]"}
      </>
    );
  }
  return (
    <>
      {"[\n"}
      {arr.map((v, i) => (
        <Fragment key={i}>
          {pad(indent + 1)}
          {renderValue(v, indent + 1)}
          {i < arr.length - 1 ? "," : ""}
          {"\n"}
        </Fragment>
      ))}
      {pad(indent)}
      {"]"}
    </>
  );
}

export function TerminalCard() {
  return (
    <div className="w-full max-h-[518px] bg-white overflow-hidden border-[0.5px] border-[rgba(76,76,59,0.3)] rounded-[6px] shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] flex flex-col">
      {/* chrome bar */}
      <div className="bg-panel h-[40px] flex items-center pl-[12px] pr-[16px] shrink-0 gap-[16px]">
        <div className="flex gap-[8px]">
          <span className="size-[12px] rounded-full bg-[#e76764] border-[0.5px] border-[#df3733]" />
          <span className="size-[12px] rounded-full bg-[#efc944] border-[0.5px] border-[#e9b809]" />
          <span className="size-[12px] rounded-full bg-[#6bc466] border-[0.5px] border-[#3bb036]" />
        </div>
        <span className="font-mono text-[10px] font-semibold text-[#82807c]">
          patient_match.json
        </span>
      </div>

      {/* code body */}
      <pre className="bg-white p-[12px] m-0 font-mono text-[10px] xl:text-[12px] leading-[1.5] whitespace-pre-wrap text-ink">
        {renderValue(data, 0)}
      </pre>
    </div>
  );
}
