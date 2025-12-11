import { useState } from "react";
import { FileText, FileDown, Image, Video, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";
import { ExportDialog } from "./ExportDialog";

interface ResearchResultProps {
  content: string;
  topic: string;
}

export const ResearchResult = ({ content, topic }: ResearchResultProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Parse sections from markdown content
  const parseContent = (text: string) => {
    const sections: { title: string; content: string; type: string }[] = [];
    const lines = text.split('\n');
    let currentSection = { title: '', content: '', type: 'text' };

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection.title || currentSection.content) {
          sections.push({ ...currentSection });
        }
        const title = line.replace('## ', '').trim();
        let type = 'text';
        if (title.toLowerCase().includes('image')) type = 'images';
        if (title.toLowerCase().includes('video')) type = 'videos';
        if (title.toLowerCase().includes('source')) type = 'sources';
        currentSection = { title, content: '', type };
      } else {
        currentSection.content += line + '\n';
      }
    }
    if (currentSection.title || currentSection.content) {
      sections.push(currentSection);
    }
    return sections;
  };

  const sections = parseContent(content);

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    return text
      .split('\n')
      .map((line, i) => {
        // Handle links
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let processedLine = line;
        let match;
        
        while ((match = linkRegex.exec(line)) !== null) {
          const [fullMatch, text, url] = match;
          processedLine = processedLine.replace(
            fullMatch,
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center gap-1">${text}<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`
          );
        }

        // Handle bold text
        processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>');
        
        // Handle bullet points
        if (processedLine.trim().startsWith('- ')) {
          const bulletContent = processedLine.trim().substring(2);
          return (
            <li key={i} className="ml-4 text-secondary-foreground" dangerouslySetInnerHTML={{ __html: bulletContent }} />
          );
        }

        if (processedLine.trim() === '') return <br key={i} />;
        
        return (
          <p key={i} className="text-secondary-foreground" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      });
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'images': return <Image className="w-5 h-5 text-primary" />;
      case 'videos': return <Video className="w-5 h-5 text-primary" />;
      case 'sources': return <BookOpen className="w-5 h-5 text-primary" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Research: <span className="gradient-text">{topic}</span>
        </h2>
        <button
          onClick={() => setShowExportDialog(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/80 transition-colors",
            "border border-border/50"
          )}
        >
          <FileDown className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              "glass-panel p-6 animate-slide-up",
              { "animation-delay-100": index > 0 }
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {section.title && (
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
                {getSectionIcon(section.type)}
                <h3 className="text-xl font-display font-medium text-foreground">
                  {section.title}
                </h3>
              </div>
            )}
            <div className="prose prose-invert max-w-none space-y-2">
              {renderMarkdown(section.content)}
            </div>
          </div>
        ))}
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        content={content}
        topic={topic}
      />
    </div>
  );
};
