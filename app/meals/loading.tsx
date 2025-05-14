import cl from './loading.module.css';

export default function MealsLoadingPage() {
  console.log('mealsLoadingPage');
  return <p className={cl.loading}>Fetching meals...</p>;
}
