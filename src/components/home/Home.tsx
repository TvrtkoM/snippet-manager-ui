import { FC, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Snippet from './Snippet';
import SnippetEditor, {SnippetEditorAction} from './SnippetEditor';
import { ISnippet, SnippetFormData } from '../models';
import UserContext from '../../UserContext';

const Home: FC = () => {
  const [snippets, setSnippets] = useState<(ISnippet)[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [formSnippet, setFormSnippet] = useState<SnippetFormData>();
  const user = useContext(UserContext);

  const getSnippets = async () => {
    try {
      if (user == null) {
        setSnippets([]);
        return;
      }
      const snippetsResponse = await axios.get(`${process.env['API_URL']}/snippet/`);
      setSnippets(snippetsResponse.data);
    } catch (e) {
      setSnippets([]);
    }
  }

  const disableTouchmove = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    getSnippets();
  }, [user?.id]);

  useEffect(() => {
    if (editorOpen) {
      document.body.classList.add('no-scroll');
      document.body.addEventListener('touchmove', disableTouchmove);
    } else {
      document.body.classList.remove('no-scroll');
      document.body.removeEventListener('touchmove', disableTouchmove);
    }
  }, [editorOpen]);

  function onEdit(snippet: ISnippet) {
    setFormSnippet(snippet);
    setEditorOpen(true);
  }

  function renderSnippets() {
    const sortedSnippets = [...snippets.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime();
    })];
    return (
      <div className="row mb-3">
        {sortedSnippets.map((s, i) => {
          return <Snippet key={i} snippet={s} onDelete={getSnippets} onEdit={onEdit} />;
        })}
      </div>
    );
  }

  async function onEditorAction(action: SnippetEditorAction) {
    if (action === 'submit') {
      await getSnippets();
    }
    setEditorOpen(false);
    setFormSnippet({});
  }

  function renderShowEditorButton() {
    return (
      <>
        <div className="row justify-content-end mb-2">
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => setEditorOpen(true)}>
              New Snippet
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="container home">
      {!editorOpen && user && renderShowEditorButton()}
      {editorOpen && <SnippetEditor snippet={formSnippet} action={onEditorAction} />}
      {renderSnippets()}
      {user && snippets.length === 0 && <span>No snippets yet.</span>}
    </section>
  );
};

export default Home;
