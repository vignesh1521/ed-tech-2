import { AuthenticationError } from 'apollo-server-micro';
import { GraphQLFieldResolver } from 'graphql';
import jwt from 'jsonwebtoken';
import { Context_Type, Token_Type } from './types';

export const secret = 'ABC123';


export function getUserFromToken(token:string) :Token_Type |null{
  try {
    if (token) {
      return jwt.verify(token, secret) as Token_Type;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const requireAuth = <TSource, TArgs>(
  resolver: GraphQLFieldResolver<TSource, Context_Type, TArgs>
): GraphQLFieldResolver<TSource, Context_Type, TArgs> => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('Authentication required');
    }
    return resolver(parent, args, context, info);
  };
};


