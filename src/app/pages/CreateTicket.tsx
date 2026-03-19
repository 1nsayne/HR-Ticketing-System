import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { EmployeeNavbar } from "../components/EmployeeNavbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Upload, X } from "lucide-react";
import { categories } from "../data/mockData";



export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [files, setFiles] = useState<File[]>([]);

  const subcategories = categories.find((c) => c.name === selectedCategory)?.subcategories || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would submit ticket to backend
    navigate("/employee");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      
      <EmployeeNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Create New Ticket</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Submit a request to HR</p>
        </div>

        <Card className="shadow-sm border-gray-200 dark:bg-gray-950 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="dark:text-white">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Auto-filled Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Name</Label>
                  <p className="text-sm font-medium mt-1 text-gray-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Employee ID</Label>
                  <p className="text-sm font-medium mt-1 text-gray-900 dark:text-white">{user.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Department</Label>
                  <p className="text-sm font-medium mt-1 text-gray-900 dark:text-white">{user.department || "N/A"}</p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="dark:text-gray-200">Request Category *</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category" className="h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory" className="dark:text-gray-200">Subcategory *</Label>
                  <Select
                    value={selectedSubcategory}
                    onValueChange={setSelectedSubcategory}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger id="subcategory" className="h-11">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="dark:text-gray-200">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your request"
                  required
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="dark:text-gray-200">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your request..."
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Maximum file size: 10MB</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="mt-4"
                      title="Upload files"
                      aria-label="File upload input"
                    />
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600"
                          title="Remove file"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="dark:text-gray-200">Priority *</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: 'rgb(176, 191, 0)', borderColor: 'rgb(176, 191, 0)' }}
                  className="hover:bg-opacity-90 h-11 px-8 text-white"
                >
                  Submit Ticket
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/employee")}
                  className="h-11 px-8"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}