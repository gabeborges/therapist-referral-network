Do not create `index.ts` barrel files for re-exporting. Import directly from the source module. Barrel files cause circular dependency issues and make tree-shaking harder.
