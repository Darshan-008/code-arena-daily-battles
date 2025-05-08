
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ChallengePage = () => {
  const { toast } = useToast();
  const [code, setCode] = useState(`function solution(input) {
  // Your code here
  return null;
}
`);
  const [results, setResults] = useState<null | { success: boolean; message: string }>(null);

  const handleRunCode = () => {
    toast({
      title: "Backend Required",
      description: "Judge0 API integration through Express.js backend required to evaluate code.",
    });
    
    // Mock result for demo
    setResults({
      success: false,
      message: "⚙️ This is a frontend-only demo. The Judge0 API would be called via an Express.js backend in the full implementation."
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Backend Required",
      description: "MongoDB and Express.js backend required to submit solutions.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark">
      <div className="container py-8 px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/challenges">
              <Button variant="outline" size="icon" className="text-codewars-light border-codewars-light">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-codewars-blue">Two Sum Challenge</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-green-600 px-2 py-1 text-xs rounded-full">Easy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-codewars-navy border-codewars-blue h-full">
              <CardHeader>
                <CardTitle className="text-codewars-light">Problem Description</CardTitle>
              </CardHeader>
              <CardContent className="text-codewars-light">
                <p className="mb-4">
                  Given an array of integers <code className="bg-codewars-dark px-1 rounded">nums</code> and an integer <code className="bg-codewars-dark px-1 rounded">target</code>, return indices of the two numbers such that they add up to <code className="bg-codewars-dark px-1 rounded">target</code>.
                </p>
                <p className="mb-4">
                  You may assume that each input would have exactly one solution, and you may not use the same element twice.
                </p>
                <p className="mb-4">You can return the answer in any order.</p>

                <div className="bg-codewars-dark p-4 rounded-md mb-4">
                  <h3 className="text-sm font-semibold mb-2">Example 1:</h3>
                  <p className="text-sm"><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                  <p className="text-sm"><strong>Output:</strong> [0,1]</p>
                  <p className="text-sm">
                    <strong>Explanation:</strong> Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].
                  </p>
                </div>

                <div className="bg-codewars-dark p-4 rounded-md mb-4">
                  <h3 className="text-sm font-semibold mb-2">Example 2:</h3>
                  <p className="text-sm"><strong>Input:</strong> nums = [3,2,4], target = 6</p>
                  <p className="text-sm"><strong>Output:</strong> [1,2]</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                    <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                    <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="code" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-codewars-dark text-codewars-light">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="flex-grow">
                <Card className="bg-codewars-navy border-codewars-blue h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-codewars-light">Your Solution (JavaScript)</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                          onClick={handleRunCode}
                        >
                          <Play className="h-4 w-4 mr-2" /> Run Code
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="relative h-full min-h-[300px] bg-codewars-dark rounded-md">
                      <textarea
                        className="absolute inset-0 w-full h-full bg-transparent text-codewars-light p-4 font-mono text-sm resize-none focus:outline-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tests">
                <Card className="bg-codewars-navy border-codewars-blue h-full">
                  <CardContent className="p-6">
                    <div className="bg-codewars-dark p-4 rounded-md text-codewars-light font-mono text-sm">
                      <p className="mb-2">// Test cases for Two Sum challenge</p>
                      <p className="mb-2">test("Example 1", () =&gt; {"{"}</p>
                      <p className="pl-4 mb-2">const nums = [2, 7, 11, 15];</p>
                      <p className="pl-4 mb-2">const target = 9;</p>
                      <p className="pl-4 mb-2">const result = solution(nums, target);</p>
                      <p className="pl-4 mb-2">expect(nums[result[0]] + nums[result[1]]).toBe(target);</p>
                      <p className="mb-2">{"}"});</p>
                      <p className="mb-2">&nbsp;</p>
                      <p className="mb-2">test("Example 2", () =&gt; {"{"}</p>
                      <p className="pl-4 mb-2">const nums = [3, 2, 4];</p>
                      <p className="pl-4 mb-2">const target = 6;</p>
                      <p className="pl-4 mb-2">const result = solution(nums, target);</p>
                      <p className="pl-4 mb-2">expect(nums[result[0]] + nums[result[1]]).toBe(target);</p>
                      <p className="mb-2">{"}"});</p>
                      <p className="mb-2">&nbsp;</p>
                      <p className="mb-2">test("Edge case - smallest array", () =&gt; {"{"}</p>
                      <p className="pl-4 mb-2">const nums = [1, 5];</p>
                      <p className="pl-4 mb-2">const target = 6;</p>
                      <p className="pl-4 mb-2">const result = solution(nums, target);</p>
                      <p className="pl-4 mb-2">expect(nums[result[0]] + nums[result[1]]).toBe(target);</p>
                      <p className="mb-2">{"}"});</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="results">
                <Card className="bg-codewars-navy border-codewars-blue h-full">
                  <CardContent className="p-6">
                    {results ? (
                      <div className={`p-4 rounded-md ${results.success ? "bg-green-600/20" : "bg-yellow-600/20"}`}>
                        <h3 className={`font-semibold mb-2 ${results.success ? "text-green-400" : "text-yellow-400"}`}>
                          {results.success ? "Success!" : "Information"}
                        </h3>
                        <p className="text-codewars-light whitespace-pre-line">{results.message}</p>
                      </div>
                    ) : (
                      <div className="text-center text-codewars-light py-8">
                        <p>Run your code to see results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
