import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";


const statements = {
  ...defaultStatements,
  user: [    
    "create",
    "read",
    "update",
    "delete",
    "update:own",
    "delete:own",
    "create:ADMINSCOL",
    "create:PERMANENT",
    "create:VACAT",
    "create:ELING",
    "create:PARENT",
    "create:COMM",

   "read:ADMINSCOL",
    "read:PERMANENT",
    "read:VACAT",
    "read:ELING",
    "read:PARENT",
    "read:COMM",

    "update:ADMINSCOL",
    "update:PERMANENT",
    "update:VACAT",
    "update:ELING",
    "update:PARENT",
    "update:COMM",
    
    "delete:ADMINSCOL",
    "delete:PERMANENT",
    "delete:VACAT",
    "delete:ELING",
    "delete:PARENT",
    "delete:COMM",

  ],
  cours: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  USER: ac.newRole({
    cours: ["create", "read", "update" ,"update:own", "delete:own"],
  }),
  ADMIN: ac.newRole(
    {cours:["create","read","update","delete","update:own","delete:own"]}
  )    

  /*ADMIN: ac.newRole({
    cours: ["create", "read","update", "delete", "update:own", "delete:own"],
    ...adminAc.statements,
  })*/
};
