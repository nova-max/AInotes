import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { analyzeNote } from '../services/gemini';

const AnalysisPanel = ({ note, onClose }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (note) {
            handleAnalyze();
        }
    }, [note]);

    const handleAnalyze = async () => {
        if (!note) return;

        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeNote(note.content || note.title);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || "Failed to analyze note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-80 bg-card border-l border-border h-screen flex flex-col shadow-xl">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Sparkles className="w-4 h-4" />
                    Gemini Analysis
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {!note ? (
                    <div className="text-center text-muted-foreground text-sm mt-10">
                        Select a note to analyze
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center mt-20 gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm">Analyzing with Gemini...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-bold">
                            <AlertCircle className="w-4 h-4" />
                            Analysis Failed
                        </div>
                        <p>{error}</p>
                        {error.includes("Missing API Key") && (
                            <p className="text-xs opacity-80 mt-2">
                                You need to add your API Key to the .env file.
                            </p>
                        )}
                    </div>
                ) : analysis ? (
                    <>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary</h4>
                            <p className="text-sm leading-relaxed">
                                {analysis.summary}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Points</h4>
                            <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                                {analysis.keyPoints?.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <h4 className="text-xs font-bold text-primary mb-1">Suggestion</h4>
                            <p className="text-xs text-primary/80">
                                {analysis.suggestion}
                            </p>
                        </div>
                    </>
                ) : null}
            </div>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !note}
                    className="w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Refresh Analysis'}
                </button>
            </div>
        </div>
    );
};

export default AnalysisPanel;
