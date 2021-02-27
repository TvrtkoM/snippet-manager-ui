import axios from 'axios';
import { FC } from 'react';
import { ISnippet } from '../models';

interface SnippetProps {
  snippet: ISnippet;
  onDelete: () => void;
  onEdit: (snippet: ISnippet) => void;
}

const Snippet: FC<SnippetProps> = ({ snippet, onDelete, onEdit }) => {
  const { title, description, code, _id } = snippet;

  function renderTitle() {
    if (!title) {
      return;
    }
    return (
      <h3 className="card-header">{title}</h3>
    );
  }

  function renderBody() {
    return (
      <div className="card-body">
        {description && <p className="card-text">{description}</p>}
        {renderCode()}
      </div>
    );
  }

  function renderCode() {
    if (!code) {
      return;
    }
    return (
      <pre className="card bg-dark text-info p-2">
        <code className="card-text">{code}</code>
      </pre>
    );
  }

  function renderFooter() {
    return (
      <div className="card-footer d-flex">
        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => onEdit(snippet)}>
          Edit
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={deleteSnippet}>
          Delete
        </button>
      </div>
    );
  }

  async function deleteSnippet() {
    try {
      await axios.delete(`${process.env['API_URL']}/snippet/${_id}`);
      onDelete();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="col-12 mb-3">
      <div className="card shadow-sm">
        {renderTitle()}
        {renderBody()}
        {renderFooter()}
      </div>
    </div>
  );
};

export default Snippet;
