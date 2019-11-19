<template>
    <div class="admin-post-page">
        <section class="update-form">
            <AdminPostForm :post="loadedPost"/>
        </section>
    </div>
</template>

<script>

import AdminPostForm from '@/components/Admin/AdminPostForm';

export default {
  layout: 'admin',
  components: {
      AdminPostForm
  } ,
  data() {
      return {
          loadedPost: {
              author: 'Dave',
              title: 'May Awesome Post',
              content: 'Super amazing, thanks for that!',
              thumbnailLink: 'https://contact-centres.com/wp-content/uploads/2017/06/tech.image_.june_.2017.jpg'
          }
      }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>