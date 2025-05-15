
import { Card, CardContent } from "@/components/ui/card";
import { Submission } from "@/hooks/useSubmissions";

interface ResultsDisplayProps {
  results: null | { success: boolean; message: string };
  existingSubmission: Submission | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  existingSubmission 
}) => {
  return (
    <Card className="bg-codewars-navy border-codewars-blue h-full">
      <CardContent className="p-6">
        {results ? (
          <div className={`p-4 rounded-md ${results.success ? "bg-green-600/20" : "bg-yellow-600/20"}`}>
            <h3 className={`font-semibold mb-2 ${results.success ? "text-green-400" : "text-yellow-400"}`}>
              {results.success ? "Success!" : "Information"}
            </h3>
            <p className="text-codewars-light whitespace-pre-line">{results.message}</p>
          </div>
        ) : existingSubmission ? (
          <div className={`p-4 rounded-md ${existingSubmission.status === "Correct" ? "bg-green-600/20" : "bg-yellow-600/20"}`}>
            <h3 className={`font-semibold mb-2 ${existingSubmission.status === "Correct" ? "text-green-400" : "text-yellow-400"}`}>
              Previous submission: {existingSubmission.status}
            </h3>
            <p className="text-codewars-light">
              {existingSubmission.status === "Correct" 
                ? `Execution time: ${existingSubmission.runtime_ms}ms` 
                : "Your previous submission was incorrect. Try again!"}
            </p>
          </div>
        ) : (
          <div className="text-center text-codewars-light py-8">
            <p>Run your code to see results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
