import { Fragment, type ReactNode } from "react";

export function fill(template: string, values: Record<string, ReactNode>) {
  return template.split(/(\{[a-zA-Z0-9]+\})/).map((token, index) => {
    const key = token.match(/^\{([a-zA-Z0-9]+)\}$/)?.[1];
    if (!key) return token;
    return <Fragment key={index}>{values[key]}</Fragment>;
  });
}
