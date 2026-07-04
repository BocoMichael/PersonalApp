function CategoryList({ categories }) {
    return (
        <section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem' }}>
            <h2>Categories</h2>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {categories.map((category) => (
                        <span key={category.id} style={{ background: '#eef2ff', padding: '0.4rem 0.7rem', borderRadius: '999px' }}>
                            {category.name}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}

export default CategoryList;