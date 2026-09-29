import React, { useState } from 'react';
import { REALMS_DATA, DATABASE_SCHEMAS } from '../../data/curriculum';
import { Database, Copy, Check, Code2, Server, BookOpen, Layers } from 'lucide-react';

export const CurriculumSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realms_json' | 'mongo_schema' | 'postgres_ddl'>('realms_json');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (activeTab) {
      case 'realms_json':
        return JSON.stringify(REALMS_DATA, null, 2);
      case 'mongo_schema':
        return JSON.stringify(DATABASE_SCHEMAS.mongodb, null, 2);
      case 'postgres_ddl':
        return DATABASE_SCHEMAS.postgresql.tables.join('\n\n');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="bg-[#0d1320] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-code text-cyan-400 uppercase tracking-wider mb-1">
            <Server className="w-4 h-4" />
            <span>Database Integration & Curriculum Architecture</span>
          </div>
          <h1 className="text-2xl font-black text-white font-fantasy tracking-wide">
            Curriculum Data Structures & Schemas
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Production-ready JSON schemas and SQL definitions for MongoDB document collections and PostgreSQL relational tables, formatted for instant database seeding.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all flex items-center gap-2 font-code shadow"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Active Schema'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs w-fit">
        <button
          onClick={() => setActiveTab('realms_json')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'realms_json'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Complete Curriculum Dataset (JSON)</span>
        </button>
        <button
          onClick={() => setActiveTab('mongo_schema')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'mongo_schema'
              ? 'bg-cyan-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MongoDB Document Schema</span>
        </button>
        <button
          onClick={() => setActiveTab('postgres_ddl')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'postgres_ddl'
              ? 'bg-indigo-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>PostgreSQL Relational DDL</span>
        </button>
      </div>

      {/* Code Display */}
      <div className="bg-[#07090f] border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-code">
          <span>
            {activeTab === 'realms_json'
              ? 'curriculum_dataset.json · 3 Realms, 9 Complete Levels'
              : activeTab === 'mongo_schema'
              ? 'mongodb_validation_schema.json'
              : 'codequest_postgres_ddl.sql'}
          </span>
          <span>{getActiveCode().split('\n').length} lines</span>
        </div>
        <pre className="mt-4 font-code text-xs text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed select-all">
          {getActiveCode()}
        </pre>
      </div>
    </div>
  );
};
