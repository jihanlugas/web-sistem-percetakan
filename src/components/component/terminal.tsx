// components/Terminal.js
import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize the xterm instance
    const term = new Terminal();
    terminalInstance.current = term;

    // Attach the terminal to the DOM
    term.open(terminalRef.current);

    // Initialize buffer to store user input
    let buffer = "";

    // Write initial content
    term.writeln("Welcome to xterm.js!");
    term.write("Type something: ");

    // Handle key events
    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.key === "Backspace") {
        if (buffer.length > 0) {
          // Remove the last character from the buffer
          buffer = buffer.slice(0, -1);

          // Move cursor back, overwrite with space, then move cursor back again
          term.write("\b \b");
        }
      } else if (domEvent.key === "Enter") {
        // Process the buffer (e.g., display it or execute commands)
        term.write("\r\nYou typed: " + buffer + "\r\n");
        buffer = ""; // Reset buffer
        term.write("Type something: ");
      } else if (printable) {
        // Add printable characters to the buffer and display them
        buffer += key;
        term.write(key);
      }
    });

    // Cleanup on component unmount
    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />;
};

export default TerminalComponent;
