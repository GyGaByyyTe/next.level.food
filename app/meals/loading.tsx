import cl from './loading.module.css';

export default function MealsLoadingPage() {
  return <p className={cl.loading}>Fetching meals...</p>;
}
