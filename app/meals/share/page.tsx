import cl from './page.module.css';
import ImagePicker from '@/components/ImagePicker';

export default function ShareMealPage() {
  return (
    <>
      <header className={cl.header}>
        <h1>
          Share your <span className={cl.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={cl.main}>
        <form className={cl.form}>
          <div className={cl.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              required
              id="instructions"
              name="instructions"
              rows={10}
            ></textarea>
          </p>
          <ImagePicker name="image" />
          <p className={cl.actions}>
            <button type="submit">Share Meal</button>
          </p>
        </form>
      </main>
    </>
  );
}
