import React, { useState } from 'react';
import { client } from './apollo-client.js';
import { createDocument, createAccount, updateAccount, deleteAccount } from './gaphQL-operations.js';

interface Account {
  id: string;
  name: string;
  // Add other account fields as needed
}

export const AccountsEditor: React.FC = () => {
  const [docId, setDocId] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleCreateDocument = async () => {
    try {
      const newDocId = await createDocument(client, 'My Accounts Document');
      setDocId(newDocId);
      console.log('Document created with ID:', newDocId);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleCreateAccount = async () => {
    if (!docId) {
      console.error('No document ID available');
      return;
    }

    try {
      const newAccount = {
        name: 'New Account',
        // Add other account fields as needed
      };
      
      const revision = await createAccount(client, docId, newAccount);
      console.log('Account created, new revision:', revision);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleUpdateAccount = async (accountId: string) => {
    if (!docId) {
      console.error('No document ID available');
      return;
    }

    try {
      const updatedAccount = {
        id: accountId,
        name: 'Updated Account Name',
        // Add other updated fields
      };
      
      const revision = await updateAccount(client, docId, updatedAccount);
      console.log('Account updated, new revision:', revision);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!docId) {
      console.error('No document ID available');
      return;
    }

    try {
      const accountToDelete = {
        id: accountId,
      };
      
      const revision = await deleteAccount(client, docId, accountToDelete);
      console.log('Account deleted, new revision:', revision);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div>
      <h2>Accounts Editor</h2>
      
      {!docId ? (
        <button onClick={handleCreateDocument}>Create New Document</button>
      ) : (
        <div>
          <p>Document ID: {docId}</p>
          <button onClick={handleCreateAccount}>Create New Account</button>
          
          <div>
            <h3>Accounts</h3>
            {accounts.map((account) => (
              <div key={account.id}>
                <span>{account.name}</span>
                <button onClick={() => handleUpdateAccount(account.id)}>Edit</button>
                <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 