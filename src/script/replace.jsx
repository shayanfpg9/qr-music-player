import React from "react";

export default function replace(text, char = "\\n", to = <br />) {
  return text.split(char).map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {to}
    </React.Fragment>
  ));
}
