
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRunCode: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRunCode,
  onSubmit,
  isSubmitting,
  isAuthenticated,
}) => {
  return (
    <Card className="bg-codewars-navy border-codewars-blue h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-codewars-light">Your Solution (JavaScript)</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
              onClick={onRunCode}
            >
              <Play className="h-4 w-4 mr-2" /> Run Code
            </Button>
            <Button 
              size="sm" 
              onClick={onSubmit}
              disabled={isSubmitting || !isAuthenticated}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative h-full min-h-[300px] bg-codewars-dark rounded-md">
          <textarea
            className="absolute inset-0 w-full h-full bg-transparent text-codewars-light p-4 font-mono text-sm resize-none focus:outline-none"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your solution here..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
