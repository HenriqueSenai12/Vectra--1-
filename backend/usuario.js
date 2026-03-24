document.addEventListener("DOMContentLoaded", () => {
    // 1. Funções para abrir e fechar com animação suave
    function openModal(modalId, contentId) {
        const modal = document.getElementById(modalId);
        const content = document.getElementById(contentId);
        if(!modal || !content) return;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
        }, 10);
    }

    function closeModal(modalId, contentId) {
        const modal = document.getElementById(modalId);
        const content = document.getElementById(contentId);
        if(!modal || !content) return;

        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // ==========================================
    // LÓGICA DE ABERTURA DOS MODAIS
    // ==========================================
    
    // Abrir o modal de "Novo Usuário" (Botão azul lá em cima)
    const btnOpenAdd = document.getElementById('btnOpenModal');
    if(btnOpenAdd) {
        btnOpenAdd.addEventListener('click', () => openModal('addUserModal', 'modalContent'));
    }

    // O SEGREDO: Abrir os modais ao clicar nos ícones da tabela!
    document.addEventListener('click', function(event) {
        // Se clicar no botão do lápis OU dentro do ícone do lápis
        const btnEdit = event.target.closest('.btn-edit-user');
        if (btnEdit) {
            openModal('editUserModal', 'editModalContent');
        }

        // Se clicar no botão da lixeira OU dentro do ícone da lixeira
        const btnDelete = event.target.closest('.btn-delete-user');
        if (btnDelete) {
            openModal('deleteUserModal', 'deleteModalContent');
        }
    });

    // ==========================================
    // LÓGICA DE FECHAMENTO DOS MODAIS
    // ==========================================

    // Fechar Modal Novo Usuário
    document.querySelectorAll('#btnCloseModal, #btnCancelModal').forEach(btn => {
        btn.addEventListener('click', () => closeModal('addUserModal', 'modalContent'));
    });

    // Fechar Modal Editar
    document.querySelectorAll('.close-edit-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal('editUserModal', 'editModalContent'));
    });

    // Fechar Modal Excluir
    document.querySelectorAll('.close-delete-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal('deleteUserModal', 'deleteModalContent'));
    });

    // Fechar qualquer modal ao clicar no fundo escuro (fora da caixa)
    const allModals = ['addUserModal', 'editUserModal', 'deleteUserModal'];
    allModals.forEach(id => {
        const modal = document.getElementById(id);
        if(modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    const contentId = id === 'addUserModal' ? 'modalContent' : 
                                      id === 'editUserModal' ? 'editModalContent' : 'deleteModalContent';
                    closeModal(id, contentId);
                }
            });
        }
    });
});
