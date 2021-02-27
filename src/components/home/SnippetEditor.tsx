import axios from 'axios';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { SnippetFormData } from '../models';

export type SnippetEditorAction = 'submit' | 'cancel';

interface EditorProps {
  snippet?: SnippetFormData;
  action: (type: SnippetEditorAction) => void;
}

const SnippetEditor: FC<EditorProps> = ({
  snippet,
  action,
}) => {
  const snip: SnippetFormData = snippet || {};
  const { title, description, code, _id } = snip;

  const [fields, setFields] = useState<SnippetFormData>({
    title: title || '',
    description: description || '',
    code: code || '',
    _id: _id || undefined,
  });

  const isEdit = title != null || description != null || code != null;
  const formHead = `${isEdit ? 'Edit' : 'New'} snippet`;

  function change(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, what: keyof SnippetFormData) {
    setFields((prevFields) => {
      return { ...prevFields, [what]: e.target.value };
    });
  }

  async function onFormSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (fields._id != null) {
        await axios.put(`${process.env['API_URL']}/snippet/${fields._id}`, fields);
      } else {
        await axios.post(`${process.env['API_URL']}/snippet/`, fields);
      }
      action('submit');
    } catch (e) {
      console.error('error posting snippet', e);
    }
  }

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="modal d-flex">
        <div className="modal-dialog">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h4 className="modal-title">{formHead}</h4>
            </div>
            <form className="modal-body" id="snippetEditor" onSubmit={onFormSubmit}>
              <div className="mb-3">
                <label htmlFor="snippetTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={fields.title}
                  id="snippetTitle"
                  className="form-control"
                  onChange={(e) => change(e, 'title')}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="snippetDescription">Description</label>
                <input
                  type="text"
                  value={fields.description}
                  id="snippetDescription"
                  className="form-control"
                  onChange={(e) => change(e, 'description')}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="snippetCode" className="form-label">
                  Code
                </label>
                <textarea
                  id="snippetCode"
                  className="form-control"
                  value={fields.code}
                  onChange={(e) => change(e, 'code')}
                ></textarea>
              </div>
              <button className="btn btn-primary btn-sm mx-1" type="submit">
                Submit
              </button>
              <button className="btn btn-secondary btn-sm mx-1" type="button" onClick={() => action('cancel')}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SnippetEditor;
