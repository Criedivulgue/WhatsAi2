'use client';

import type { UserProfile, Contact, Chat, Brand, User } from '@/lib/types';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';

/**
 * FirestoreDataConverter for the simple User object.
 */
export const userConverter: FirestoreDataConverter<User> = {
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      brandId: data.brandId,
      avatarUrl: data.avatarUrl,
      attendantPersona: data.attendantPersona,
    };
  },
  toFirestore(user: WithFieldValue<User>): DocumentData {
    const { id, ...data } = user;
    return data;
  },
};

/**
 * FirestoreDataConverter for the Brand object.
 */
export const brandConverter: FirestoreDataConverter<Brand> = {
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Brand {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      brandName: data.brandName,
      slogan: data.slogan,
      brandTone: data.brandTone,
      hardRules: data.hardRules,
      softRules: data.softRules,
      knowledgeBase: data.knowledgeBase,
      aiConfig: data.aiConfig,
    };
  },
  toFirestore(brand: WithFieldValue<Brand>): DocumentData {
    const { id, ...data } = brand;
    return data;
  },
};


/**
 * FirestoreDataConverter for the UserProfile type (DEPRECATED - Use User and Brand). 
 */
export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserProfile {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      email: data.email,
      publicName: data.publicName,
      slogan: data.slogan,
      avatarUrl: data.avatarUrl,
      city: data.city,
      state: data.state,
      whatsappNumber: data.whatsappNumber,
      attendantPersona: data.attendantPersona,
      brandTone: data.brandTone,
      knowledgeBase: data.knowledgeBase,
      hardRules: data.hardRules,
      softRules: data.softRules,
      aiConfig: data.aiConfig,
      createdAt: data.createdAt,
    };
  },
  toFirestore(profile: WithFieldValue<UserProfile>): DocumentData {
    const { id, ...data } = profile;
    return data;
  },
};

/**
 * FirestoreDataConverter for the Contact type.
 */
export const contactConverter: FirestoreDataConverter<Contact> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Contact {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      name: data.name,
      phone: data.phone,
      contactType: data.contactType,
      email: data.email,
      notes: data.notes,
      avatar: data.avatar,
      categories: data.categories,
      interests: data.interests,
    };
  },
  toFirestore(contact: WithFieldValue<Contact>): DocumentData {
    const { id, ...data } = contact;
    return data;
  },
};

/**
 * FirestoreDataConverter for the Chat type.
 */
export const chatConverter: FirestoreDataConverter<Chat> = {
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Chat {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      contactId: data.contactId,
      status: data.status,
      lastMessageTimestamp: data.lastMessageTimestamp,
      lastMessageContent: data.lastMessageContent,
      messages: [], 
      contact: undefined, 
    };
  },
  toFirestore(chat: WithFieldValue<Chat>): DocumentData {
    const { id, contact, messages, ...data } = chat;
    return data;
  },
};
