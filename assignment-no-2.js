document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const editForm = document.getElementById('editForm');
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');

    // Add new expense
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(expenseForm);
        const data = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount'))
        };

        try {
            const response = await fetch('/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error adding expense');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding expense');
        }
    });

    // Edit expense
    window.editExpense = async (id) => {
        const expenseItem = document.querySelector(`[data-id="${id}"]`);
        const description = expenseItem.querySelector('.description').textContent;
        const amount = expenseItem.querySelector('.amount').textContent.replace('$', '');

        document.getElementById('editId').value = id;
        document.getElementById('editDescription').value = description;
        document.getElementById('editAmount').value = amount;

        modal.style.display = 'block';
    };

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Save edited expense
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const formData = new FormData(editForm);
        const data = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount'))
        };

        try {
            const response = await fetch(`/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error updating expense');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating expense');
        }
    });

    // Delete expense
    window.deleteExpense = async (id) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                const response = await fetch(`/expenses/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Error deleting expense');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting expense');
            }
        }
    };
});