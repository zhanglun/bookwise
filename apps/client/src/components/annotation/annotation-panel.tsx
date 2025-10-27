import React, { useState } from 'react';
import { Annotation } from './types';

interface AnnotationPanelProps {
  annotations: Annotation[];
  onAnnotationClick: (annotation: Annotation) => void;
  onAnnotationDelete: (annotation: Annotation) => void;
  onAnnotationEdit: (annotation: Annotation) => void;
}

export const AnnotationPanel: React.FC<AnnotationPanelProps> = ({
  annotations,
  onAnnotationClick,
  onAnnotationDelete,
  onAnnotationEdit,
}) => {
  const [filter, setFilter] = useState<'all' | 'highlight' | 'note' | 'ink' | 'shape'>('all');

  const filteredAnnotations = annotations.filter((ann) => filter === 'all' || ann.type === filter);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'highlight':
        return '🖍️';
      case 'note':
        return '📝';
      case 'ink':
        return '✏️';
      case 'shape':
        return '⬜';
      default:
        return '📌';
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          padding: '16px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          标注列表 ({annotations.length})
        </h3>
      </div>

      {/* 过滤器 */}
      <div
        style={{
          padding: '12px 16px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: '8px',
        }}
      >
        {['all', 'highlight', 'note', 'ink', 'shape'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: filter === type ? '#2196f3' : 'white',
              color: filter === type ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {type === 'all'
              ? '全部'
              : type === 'highlight'
                ? '高亮'
                : type === 'note'
                  ? '批注'
                  : type === 'ink'
                    ? '墨迹'
                    : '形状'}
          </button>
        ))}
      </div>

      {/* 标注列表 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
        }}
      >
        {filteredAnnotations.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              color: '#999',
            }}
          >
            暂无标注
          </div>
        ) : (
          filteredAnnotations.map((annotation) => (
            <div
              key={annotation.id}
              onClick={() => onAnnotationClick(annotation)}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* 标注头部 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{getTypeIcon(annotation.type)}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    {formatDate(annotation.createdAt)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnnotationEdit(annotation);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnnotationDelete(annotation);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #f44336',
                      background: 'white',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* 高亮颜色指示 */}
              {annotation.type === 'highlight' && (
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: annotation.style.color,
                    borderRadius: '2px',
                    marginBottom: '8px',
                  }}
                />
              )}

              {/* 选中的文本 */}
              {annotation.content?.text && (
                <div
                  style={{
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '8px',
                    lineHeight: '1.5',
                  }}
                >
                  "{annotation.content.text}"
                </div>
              )}

              {/* 批注内容 */}
              {annotation.content?.note && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    padding: '8px',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    borderLeft: '3px solid #2196f3',
                  }}
                >
                  {annotation.content.note}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
