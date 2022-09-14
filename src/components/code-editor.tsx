import './code-editor.css'
import './syntax.css'
import { useRef } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import codeShift from 'jscodeshift'
import HighLighter from 'monaco-jsx-highlighter'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>()

  const OnMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue())
    })

    editor.getModel()?.updateOptions({ tabSize: 2 })

    const highlighter = new HighLighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor
    )
    highlighter.highlighteOnDidChangeModelContent(
      () => {},
      () => {
        undefined
      },
      () => {}
    )
  }

  const onFormat = () => {
    const unformatted = editorRef.current.getModel().getValue()

    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '')

    editorRef.current.setValue(formatted)
  }

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormat}
      >
        Format
      </button>
      <Editor
        onMount={OnMount}
        value={initialValue}
        theme="vs-dark"
        language="javascript"
        height="500px"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
