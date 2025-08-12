# Firestore Index Setup for EOD Notes

## 🎯 Required Index for EOD Notes

The EOD Notes feature requires a composite index for efficient querying by user and date.

## 📋 Index Configuration

### **Collection**: `eod_notes`
### **Fields to Index**:
1. `userId` (Ascending)
2. `date` (Ascending)

## 🚀 How to Create the Index

### Option 1: Automatic Creation (Recommended)
1. **Try using the EOD Notes feature** in your app
2. **Firebase will show an error** with a direct link to create the index
3. **Click the link** in the error message
4. **Firebase will auto-generate the exact index needed**

### Option 2: Manual Creation
1. **Go to**: https://console.firebase.google.com/
2. **Select**: Your `todo-c389c` project
3. **Navigate**: Firestore Database → Indexes
4. **Click**: "Create Index"
5. **Configure**:
   - **Collection ID**: `eod_notes`
   - **Fields**:
     - Field: `userId`, Type: `Ascending`
     - Field: `date`, Type: `Ascending`
   - **Query scope**: `Collection`
6. **Click**: "Create"

## 🔍 Index Details

**This index supports queries like:**
```javascript
// Get EOD note for specific user and date range
collection('eod_notes')
  .where('userId', '==', userId)
  .where('date', '>=', startOfDay)
  .where('date', '<=', endOfDay)
```

## ⏱️ Index Creation Time

- **Small projects**: 1-2 minutes
- **Larger projects**: Up to 10 minutes
- **Status**: Check "Indexes" tab for build progress

## ✅ Verification

After the index is built:
1. **Refresh your app**
2. **Try writing an EOD note**
3. **Try viewing notes from different dates**
4. **Should work without errors**

## 🚨 Error Messages to Watch For

If you see these errors, you need the index:
- `The query requires an index`
- `Failed to get documents from server`
- `FAILED_PRECONDITION`

The error message will include a direct link to create the required index automatically.
